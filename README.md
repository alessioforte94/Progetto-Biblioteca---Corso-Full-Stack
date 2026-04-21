# Biblioteca Online, Progetto Full Stack

Questo progetto è stato creato sulla base di una esercitazione universitaria, per renderlo totalmente fruibile e mantenere correttamente il tracciamento dello storico dei dati bisogna apportare
alcune modifiche al db. Aggiungere una colonna ACTIVE/DELETED sui libri e sugli user per evitare le chiamate DELETE e sostituirle con delle POST dove al varirare del valore di questa colonna si rendono 
disponibili o meno i libri per il nolo. Da implementare anche la gestione utenti (manca la possibilità di eliminare un utente con le varie limitazioni del caso) ed un sistema di gestione dei pagamenti
(qualora lo si volesse rendere a tutti gli effetti un portale di noleggio online)

Funzionalità principali:
Autenticazione Utenti
Ruoli (User/Admin)
Catalogo Libri
Sistema di noleggio
Dashboard Admin
Sistema Fedeltà

Tecnologie Utilizzate:
React + Vite + MUI
Node.js + Express
PRISMA ROM + MySQL

Esperienza utente intuitiva, pratica e dinamica
Lato client totalmente responsive
