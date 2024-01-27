import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, Icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <input
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
      />
      <Icon width={18} className="input-icon text-zinc-600" />

      {type == "password" ? (
        passwordVisible ? (
          <EyeOff
            width={18}
            className="input-icon left-auto right-6 cursor-pointer text-zinc-600"
            onClick={() => setPasswordVisible((curr) => !curr)}
          />
        ) : (
          <Eye
            width={18}
            className="input-icon left-auto right-6 cursor-pointer text-zinc-600"
            onClick={() => setPasswordVisible((curr) => !curr)}
          />
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
