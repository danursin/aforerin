import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<unknown | string>) {
    try {
        const result = { works: true };
        res.json(result);
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
}