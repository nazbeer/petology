// src/components/NotFound.js
import React from "react";

function NotFound() {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-4">404</h1>
        <p className="lead">Page not found</p>
        <p className="text-muted">
          The page you're looking for does not exist.
        </p>
        <a href="/" className="btn btn-success btn-sm mt-3">
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
