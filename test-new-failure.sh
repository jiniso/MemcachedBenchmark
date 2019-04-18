docker-compose down
docker-compose up -d

current_time=$(date "+%Y.%m.%d-%H.%M.%S")
filename="./results/new-failure/hey.$current_time.txt"
echo "filename: $filename" 
npm run hey-new > $filename