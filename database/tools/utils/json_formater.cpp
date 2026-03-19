#include <fstream>
#include <iostream>
#include <sstream>
#include <fstream>


std::string	parse_line(const std::string &line) {
	std::istringstream iss(line);
	std::string ingredient, quantity, unit;
	std::getline(iss, ingredient, '\t');
	std::getline(iss, quantity, '\t');
	std::getline(iss, unit, '\t');

	std::string res = "\t{";
	res += std::string("\"name\": ") + "\"" + ingredient + "\"" + ", ";
	res += std::string("\"quantity\": ") + quantity + ", ";
	res += std::string("\"unit\": ") + "\"" + unit + "\"" + "}";
	return res;
}

int main(int ac, char **av) {
	if (ac == 1) {
		std::cerr << "Usage: " << av[0] << " <ingredient file 1> <ingredient file 2> <ingredient file 3>..." << std::endl;
		return 1;
	}
	for (int i = 1; i < ac ;i++) {
		std::ifstream infile(av[i]);
		if (!infile.is_open()){
			std::cerr << "Can't open file: " << av[i] << std::endl;
			continue;
		}
		// Read all lines from input file
		std::string line, out;
		while (std::getline(infile, line)) {
		    out += parse_line(line);
		    if (infile.peek() != EOF)  // If this is not the last line
		        out += ",\n";
		    else
		        out += "\n";
		}

		// Create outfile with the out string
		std::string name = std::string(av[i]);
		size_t dotPos = name.find_first_of(".");
		name = name.substr(0, dotPos);
		name += "::ingredients.json";
		name = "./JSONB/" + name;
		std::ofstream outfile(name.c_str());
		outfile << "[\n";
		outfile << out;
		outfile << "]";
		std::cout << "File " << name << " successfully created" << std::endl;
		infile.close();
	}
}

