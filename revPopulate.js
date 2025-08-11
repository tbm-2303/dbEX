use pageturners

db.reviews.insertMany([
  {
    reviewId: 1,
    bookId: 1001,
    customerId: 1,
    rating: 5,
    comment: "Amazing read!",
    reviewDate: new Date("2025-08-01")
  },
  {
    reviewId: 2,
    bookId: 1002,
    customerId: 2,
    rating: 4,
    comment: "Really good, but a bit long.",
    reviewDate: new Date("2025-08-02")
  },
  {
    reviewId: 3,
    bookId: 1003,
    customerId: 3,
    rating: 3,
    comment: "Average, nothing special.",
    reviewDate: new Date("2025-08-03")
  },
  {
    reviewId: 4,
    bookId: 1004,
    customerId: 4,
    rating: 2,
    comment: "Not my type of book.",
    reviewDate: new Date("2025-08-04")
  }
])
