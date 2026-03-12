 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(error: any, context?: any) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // This is where you would call Sentry.captureException(error)
    console.error(`[PRODUCTION ERROR]`, error, context);
  } else {
    console.error(`[DEVELOPMENT ERROR]`, error, context);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logInfo(message: string, context?: any) {
  console.log(`[INFO] ${message}`, context);
}
