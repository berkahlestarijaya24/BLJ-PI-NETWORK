// store.js
import { configureStore } from "@reduxjs/toolkit"
import { apiService } from "./services/apiService"
import generalReducer from "./reducer/generalReducer"

const store = configureStore({
  reducer: {
    general: generalReducer, // Adding the global slice here
    [apiService.reducerPath]: apiService.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
})

export default store
