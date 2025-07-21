export default function debounce<T extends (...args: unknown[]) => unknown>(func: T) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    console.log("hello")
    return function (this: unknown, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), 30);
    };
  }
  // function debouncer(func, delay) {
  //   let timer;
  //   return function (...args) {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => func.apply(this, args), delay);
  //   };
  // }

//   const debouncedSendUserDetails = debounce(sendUserDetails, ); // 300ms delay