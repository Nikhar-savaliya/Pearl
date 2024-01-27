import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import serviceAccountKey from "./quill-blogs-firebase-adminsdk-dfmww-52fe1162bd.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

// SCHEMA
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import { nanoid } from "nanoid";
import cors from "cors";

const server = express();

server.use(express.json());
server.use(cors());

let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// ------- CONNECT WITH MONGODB ----------
mongoose
  .connect(process.env.DB_URI, { autoIndex: true })
  .then(() => console.log("mongoDB connected"));

//  ------------- MIDDLEWARE --------------

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Access denied!" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid" });
    }
    req.user = user.id;
    next();
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    access_token,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let usernameExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  usernameExists ? (username = username + "-" + nanoid(5)) : "";

  return username;
};

//  --------- ROUTES ----------
server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  // validating data from frontend
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Full name must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Email required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Invalid Email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "password must be 6 to 20 characters long with a numeric, 1 lowervcase and 1 uppercase letters.",
    });
  }

  bcrypt.hash(password, 10, async (err, hashedPass) => {
    let username = await generateUsername(email);
    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPass,
        username,
      },
    });
    user
      .save()
      .then((u) => {
        res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "email aleady exists." });
        }
        res.status(500).json({ error: err.message });
      });
  });
});

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(403).json({ error: "email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "error occured while logging in" });
          }
          if (!result) {
            return res.status(403).json({ error: "Incorrect Password" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({
          error:
            "This email is registered using google, try signing in with google.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.error });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      // console.log(decodedUser)
      let { email, name: fullname, picture } = decodedUser;
      picture = picture.replace("s96-c", "s384-c"); // change picture URL to get high-resolution profile image.
      let user = null;
      try {
        user = await User.findOne({ "personal_info.email": email }).select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        );
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      if (user) {
        if (!user.google_auth) {
          // login
          return res.status(403).json({
            error:
              "This email was not signed up with Google. Please log in using email and password.",
          });
        }
      } else {
        // signup
        let username = await generateUsername(email);
        user = new User({
          personal_info: {
            fullname,
            email,
            profile_img: picture, // Fix: Use the 'picture' variable here
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((e) => res.status(500).json({ error: e.message }));
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

server.post("/create-blog", verifyJWT, (req, res) => {
  console.log(req.body);
  let authorId = req.user;

  let { title, banner, content, tags, description, draft } = req.body;

  if (!title.length) {
    return res.status(403).json({ error: "you must provide blog title." });
  }
  if (draft) {
    if (!description.length) {
      return res
        .status(403)
        .json({ error: "you must provide blog description." });
    }
    if (!banner.length) {
      return res.status(403).json({ error: "you must provide blog banner." });
    }
    if (!content.blocks.length) {
      return res.status(403).json({ error: "you must provide blog content" });
    }
    if (!tags.length) {
      return res.status(403).json({ error: "you must provide tags" });
    }
  }

  tags = tags.map((t) => t.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  let blog = new Blog({
    title,
    description,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });
  blog
    .save()
    .then((blog) => {
      let increasePostCount = draft ? 0 : 1;

      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": increasePostCount },
          $push: { blogs: blog._id },
        }
      )
        .then((user) => {
          console.log("user Registerd");
          res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: "failed to upldate total post number" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.post("/latest-blogs", (req, res) => {
  let { page } = req.body;
  let maxLimit = 3;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title description banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      res.status(200).json({ totalDocs: count });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

server.post("/search-blogs-count", (req, res) => {
  let { tag, query } = req.body;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  }
  Blog.countDocuments({ tags: tag, draft: false })
    .then((count) => {
      res.status(200).json({ totalDocs: count });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

server.get("/trending-blogs", (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_like": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.post("/search-users", (req, res) => {
  let { query } = req.body;
  User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(25)
    .select(
      "personal_info.username personal_info.fullname personal_info.profile_img -_id"
    )
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
server.post(`/search-blogs`, (req, res) => {
  let { tag, page, query } = req.body;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  }
  let maxLimit = 1;
  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title description banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.post("/get-profile", (req, res) => {
  let { username } = req.body;
  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -_id -google_auth -updatedAt -blogs")
    .then((user) => res.status(200).json(user))
    .catch((err) => res.this.status(500).json({ error: err.message }));
});

// ------------- SERVER LISTENING ON PORT 3000 -----------
server.listen(PORT, () => {
  console.log(`server started at port:  ${PORT}`);
});
