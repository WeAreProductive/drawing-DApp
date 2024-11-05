const Contest = ({ data }: any) => {
  return (
    <>
      <div>{data.title}</div>
      <div>created by: {data.created_by}</div>
    </>
  );
};

export default Contest;
