#!/bin/bash
# Double-clique ce fichier (macOS) : il demarre le cerveau et ouvre le navigateur.
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js n'est pas installe."
  echo "Installe-le ici : https://nodejs.org (bouton LTS), puis double-clique a nouveau."
  read -r -p "Appuie sur Entree pour fermer."
  exit 1
fi

echo "Cerveau en cours de demarrage..."
node server.js &
SERVER_PID=$!
sleep 1
open "http://localhost:3000"

echo ""
echo "  Le cerveau tourne sur http://localhost:3000"
echo "  Ferme cette fenetre pour l'arreter."
echo ""
trap 'kill $SERVER_PID 2>/dev/null' EXIT
wait $SERVER_PID
