mkdir temp
nix-channel --update
nix-env -iA nixpkgs.zlib
nix-env -iA nixpkgs.libtool
nix-env -iA nixpkgs.pkg-config
nix-env -iA nixpkgs.jdk17
nix-env -iA nixpkgs.leptonica
nix-env -iA nixpkgs.jbig2enc
nix-env -iA nixpkgs.tesseract
nix-env -iA nixpkgs.unpaper
nix-env -iA nixpkgs.libreoffice
nix-env -iA nixpkgs.ocrmypdf
nix-env -iA nixpkgs.poppler_utils

pip3 install uno opencv-python-headless unoconv pngquant WeasyPrint

git clone https://github.com/Stirling-Tools/Stirling-PDF.git
cd Stirling-PDF
chmod +x ./gradlew
./gradlew build
