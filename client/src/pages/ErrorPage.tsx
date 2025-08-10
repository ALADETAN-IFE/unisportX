import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let message: string;
  if (isRouteErrorResponse(error)) {
    message = error.statusText || String(error.data);
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Unknown error";
  }

  return (
    <div 
      className="bg-white dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-white justify-center items-center gap-3">
      <h1>Oopss!</h1>
      {
        message == "Not Found" ? 
          <p>
            <i>This page can{message.slice(0, 3).toLocaleLowerCase()} be {message.slice(3).toLocaleLowerCase()} or has been removed</i>
          </p>
        :
        <>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{message}</i>
          </p>
        </>
      }
      <div className="flex flex-col gap-2 sm:flex-row">
      <button onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600"
      >Try again</button>
      <button onClick={() => window.history.back()} 
        className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600"
      >Go back</button>
      </div>
    </div>
  );
};

export default ErrorPage;