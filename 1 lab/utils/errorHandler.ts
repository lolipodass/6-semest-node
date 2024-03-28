import { Response } from "express"


export function handleError(error: unknown, res: Response) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        res.status(500).json({ message: (error as { message: string }).message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
}