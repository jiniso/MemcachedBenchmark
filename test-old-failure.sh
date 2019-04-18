docker-compose down
docker-compose up -d

current_time=$(date "+%Y.%m.%d-%H.%M.%S")
filename="./results/old-failure/hey.$current_time.txt"
echo "filename: $filename" 
npm run hey-old > $filename