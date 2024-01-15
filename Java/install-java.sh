# install-java.sh
cd /home/user
if ! [ -d jdk-19.0.2 ]; then
wget https://download.java.net/java/GA/jdk19.0.2/fdb695a9d9064ad6b064dc6df578380c/7/GPL/openjdk-19.0.2_linux-x64_bin.tar.gz
tar -xvf openjdk-19.0.2_linux-x64_bin.tar.gz
rm openjdk-19.0.2_linux-x64_bin.tar.gz
fi