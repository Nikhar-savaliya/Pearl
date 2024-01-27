import axios from "axios";

export const filterPaginationData = async ({
  createNewArray = false,
  blogState,
  newData,
  page,
  countRoute,
  dataToSend = {},
}) => {
  let object;
  if (blogState != null && createNewArray == false) {
    object = {
      ...blogState,
      results: [...blogState.results, ...newData],
      page: page,
    };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_URL + countRoute, dataToSend)
      .then(({ data: { totalDocs } }) => {
        object = { results: newData, page: 1, totalDocs };
      });
  }
  return object;
};
