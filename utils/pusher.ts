import { NextApiResponse } from 'next';
import Pusher from 'pusher';
import { RequestError } from '../types/interfaces';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

async function emitPusherEvent(
  res: NextApiResponse,
  channel: string,
  event: string,
  payload: any
) {
  try {
    await pusher.trigger(channel, event, payload);
  } catch (err) {
    const error = err as RequestError;
    return res.status(error.status).send(error.message);
  }
}

export default emitPusherEvent;
