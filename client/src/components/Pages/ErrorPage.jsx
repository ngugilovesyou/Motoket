const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
      <p className="text-xl mt-4">Something went wrong. Please try again.</p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Go Home
      </a>
    </div>
  );
};

export default ErrorPage;
