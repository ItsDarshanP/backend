// const asyncHandler = (func) => (req, res, next) => {
//   Promise
//   .resolve(func(req, res, next))
//   .catch((err) => next(err));
// };

const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise
    .resolve(func(req, res, next))
    .catch((err) => next(err));
  };
};

export { asyncHandler };

// normal
// const asyncHandler = ()=>{}

// when pass a function
// const asyncHandler = (fun) => { () => {}}
// const asyncHandler = (fun) => { async () => {}}
// or
// const asyncHandler = (fun) => async () => {}

// explanation :
// Takes a function (func) as an argument.
// Returns an async function that wraps func inside a try-catch.
// Executes func(req, res, next) and catches any errors.

// higher order function that accept another function as parameter
/*
const asyncHandler = (func) => async (req,res,next) => {
    try {
        await func(req,res,next)
        
    } catch (error) {
        res.status(error.code || 500).json({
            success : false,
            message : error.message || "Internal Server Error"
        })
    }
}
    */
