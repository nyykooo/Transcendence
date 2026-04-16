#include <iostream>
#include <iomanip>
#include <fstream>

std::string allToLower(const std::string &line) {
    std::string ret;
    for (char c : line)
        ret += std::tolower(c);
    return ret;
}

int main(int ac, char **av) {
    if (ac == 2) {
        std::ifstream infile(av[1]);
        if (!infile.is_open()){
            std::cerr << "can't open file" << std::endl;
            return 2;
        }
        std::string line, out;
        while (std::getline(infile, line)) 
            out += allToLower(line);
        std::string name = "lower_";
        name += std::string(av[1]);
        std::ofstream outFile(name.c_str());
        if (outFile.is_open()) {
            outFile << out;
            outFile.close();
        }
        infile.close();
        std::cout << "File: " << name << " successfully created!" << std::endl;
        return 0;
    }
    std::cerr << "Invalid input" << std::endl;
    return 1;
}