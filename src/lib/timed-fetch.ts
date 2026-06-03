export const API_TIMEOUT_MS = 5000;

const timeoutMessage = "A API demorou mais de 5 segundos para responder.";

const createTimeoutError = () =>
  new DOMException(timeoutMessage, "TimeoutError");

export const isRequestTimeoutError = (error: unknown) =>
  error instanceof DOMException && error.name === "TimeoutError";

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const externalSignal = init.signal;
  const timeout = setTimeout(() => {
    controller.abort(createTimeoutError());
  }, timeoutMs);

  const abortFromExternalSignal = () => {
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal?.aborted) {
    abortFromExternalSignal();
  } else {
    externalSignal?.addEventListener("abort", abortFromExternalSignal, {
      once: true,
    });
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    const abortReason = controller.signal.reason;

    if (isRequestTimeoutError(abortReason)) {
      throw abortReason;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }
}
