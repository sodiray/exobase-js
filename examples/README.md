# Examples

All the Exobase example projects are modeled after a real API that provides a `setTimeout` and `setInterval` functionality at the infrastructure level. _a.k.a a Callback API_.

## Treasure Hunt!

To understand the true power of Exobase, I recommend opening the endpoints for the different example project in neighbooring windows or tabs. You'll notice that it's 99% copy + paste. That's the magic. Exobase decouples your code from the underlying framework.

## Endpoints

No matter the underlying architecture or framework each example will have the same endpoints:

| Method | Path                     | Description                                                                                                           |
| ------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| GET    | `/ping`                  | A health check endpoint that always returns pong                                                                      |
| POST   | `/v1/timeout`            | Create a new timeout. When the timeout is up, a request will be made back to the caller using the information posted. |
| GET    | `/v1/timeout`            | Get all active timeouts                                                                                               |
| GET    | `/v1/timeout/{id}`       | Get a timeout by id                                                                                                   |
| PUT    | `/v1/timeout/{id}/clear` | Clear a timeout by id                                                                                                 |
