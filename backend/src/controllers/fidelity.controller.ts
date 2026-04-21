import { Request, Response } from 'express';

import { changeFidelityScore, showFidelity } from '../models/fidelity.model';

export const showFidelityController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const userFidelity = await showFidelity({ id });
    res.json(userFidelity);
  } catch (error) {
    console.log(error);
    res.status(500).json('failed to fetch');
  }
};

export const changeFidelityScoreController = async (req: Request, res: Response) => {
  const { point, operation } = req.body;
  if (!point || !operation) {
    res.status(400).json({ error: 'Campi mancanti: inserisci point e operation (add/subtract)' });
    return;
  }
  if (operation !== 'add' && operation !== 'subtract') {
    res.status(400).json({ error: "Il campo operation deve essere 'add' oppure 'subtract'" });
    return;
  }
  if (isNaN(Number(point)) || Number(point) <= 0) {
    res.status(400).json({ error: 'Il campo point deve essere un numero positivo' });
    return;
  }
  try {
    const id = Number(req.params.id);
    await changeFidelityScore({ id, point: Number(point) }, operation);
    res.json({ message: `Punti ${operation === 'add' ? 'aggiunti' : 'sottratti'} con successo` });
  } catch (error) {
    console.error('Errore aggiornamento fidelity score: ', error);
    res.status(500).json({ message: 'Errore durante la modifica del punteggio', error });
  }
};
