const DoomFrame = () => (
  <iframe
    title="Freedoom"
    src="/games/doom/index.html"
    className="w-full flex-grow border-0 bg-black"
    allow="fullscreen; autoplay"
    sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock"
  />
);

export default DoomFrame;
