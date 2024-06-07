const YCenteredBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center self-stretch flex flex-col justify-center row-start-2 row-end-auto">
    {children}
  </div>
);

export default YCenteredBlock;
