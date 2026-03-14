import { Request, Response } from 'express';
import axios from 'axios';

export const getLichessProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const { data } = await axios.get(`https://lichess.org/api/user/${username}`, {
      headers: {
        Accept: 'application/json'
      }
    });

    return res.json({
      username: data.username,
      perfs: data.perfs,
      profile: data.profile,
      count: data.count
    });
  } catch {
    return res.status(404).json({ message: 'Lichess user not found' });
  }
};
