// This file previously duplicated api/axios.js with a hardcoded baseURL
// (breaking in any non-localhost deployment) and was missing the 401
// auto-logout interceptor that the other copy had. Now there's exactly one
// real axios instance — this just re-exports it, so every existing import
// of "services/api" keeps working unchanged.
export { default } from "../api/axios";