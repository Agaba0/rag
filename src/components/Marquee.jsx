const MarqueeText = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden whitespace-nowrap bg-blue-400 text-white">
      <div className="animate-marquee inline-block text-2xl font-bold p-2">
        Welcome &nbsp; to &nbsp; your &nbsp; AI &nbsp; support &nbsp; learning
        &nbsp; platform
      </div>
    </div>
  );
};

export default MarqueeText;
