import ErrorPage from "./errorPage";

export default function NotFound() {
    return <ErrorPage status={404} message="The requested page was not found." />;
}