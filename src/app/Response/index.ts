const resp = (scs: boolean, msg: string, data: any) => {
  // data = data ?? [];
  if (scs) {
    return {
      success: true,
      msg,
      data,
    };
  }
  return {
    success: false,
    msg,
    data,
  };
};

export default resp;
