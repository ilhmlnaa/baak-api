const response = (statusCode, data, message, res) => {
    res.send(statusCode, [
      {
        payload: data,
        message,
        metadata: {
          prev: "",
          next: "",
          curent: "",
        },
      },
    ]);
  };
  
  module.exports = response;
  