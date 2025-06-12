interface LoadingSpinnerProps {
  size?: "mini" | "default";
  className?: string;
}

function LoadingSpinner({
  size = "default",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    mini: "w-4 h-4",
    default: "w-8 h-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Mini version specifically for buttons
function LoadingSpinnerMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-current w-4 h-4 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
export { LoadingSpinnerMini };
