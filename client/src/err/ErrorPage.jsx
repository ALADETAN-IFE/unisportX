// const ErrorPage = ({ error, resetErrorBoundary }) => {
//     return (
//       <div>
//         <h1>Something went wrong!</h1>
//         <p>Error message: {error.message}</p>
//         <button onClick={resetErrorBoundary}>Try again</button>
//       </div>
//     );
//   };

//   export default ErrorPage

const ErrorPage = ({ error, resetErrorBoundary }) => {
    return (
      <div>
        <h1>Something went wrong!</h1>
        {error}
        {error && <p>Error message: {error.message}</p>}
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };
  
  export default ErrorPage;

  
// import React from 'react';
// import { ErrorBoundary as RB } from 'react-error-boundary';

// const ErrorFallback = ({ error }) => {
//   return (
//     <div role="alert">
//       <h2>Something went wrong!</h2>
//       <pre>{error.message}</pre>
//       <button onClick={() => window.location.reload()}>Try again</button>
//     </div>
//   );
// };

// const ErrorBoundary = ({ children }) => {
//   return (
//     <RB FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
//       {children}
//     </RB>
//   );
// };

// export default ErrorBoundary;
  

// import React from 'react';
// import { ErrorBoundary as RB } from 'react-error-boundary';

// const ErrorFallback = ({ error }) => {
//   return (
//     <div role="alert">
//       <h2>Something went wrong!</h2>
//       <pre>{error.message}</pre>
//       <button onClick={() => window.location.reload()}>Try again</button>
//     </div>
//   );
// };

// const ErrorBoundary = ({ children }) => {
//   return (
//     <RB FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
//       {children}
//     </RB>
//   );
// };

// export default ErrorBoundary;

    