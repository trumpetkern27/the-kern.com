
using the_kern.com.Models;
using System.Text;
using System.Collections;

namespace the_kern.com.Services
{
    public class DFAAnalyzer
    {
        public DescribeLanguageResponse DescribeLanguage(DFA dfa)
        {

            var regex = ConvertDfaToRegex(dfa);

            return new DescribeLanguageResponse
            {
                Regex = regex
            };
        }

        

        private string ConvertDfaToRegex(DFA dfa)
        {
            var states = dfa.Nodes.Select(n => n.Id).ToList();
            string start = dfa.Nodes.First(n => n.isStart).Id;
            var accepts = dfa.Nodes.Where(n => n.isAccept).Select(n => n.Id).ToList();

            Console.WriteLine($"States: {string.Join(", ", states)}");
            Console.WriteLine($"Start: {start}");
            Console.WriteLine($"Accepts: {string.Join(", ", accepts)}");

            var R = new Dictionary<string, Dictionary<string, string>>();

            foreach (string i in states)
            {
                R[i] = new Dictionary<string, string>();
                foreach (string j in states)
                    R[i][j] = "";
            }

            foreach (var e in dfa.Edges)
            {
                string from = e.From;
                string to = e.To;
                string sym = string.IsNullOrEmpty(e.Symbol) ? "ε" : e.Symbol;

                if (R[from][to] == "")
                    R[from][to] = sym;
                else
                    R[from][to] = Union(R[from][to], sym);

                Console.WriteLine($"Added edge: {from} -> {to} : {sym}");
            }

            Console.WriteLine("\nInitial R:");
            PrintRTable(R, states);

            string S = "_S";
            string F = "_F";

            states.Add(S);
            states.Add(F);

            R[S] = new Dictionary<string, string>();
            R[F] = new Dictionary<string, string>();

            foreach (string i in states)
            {
                if (!R.ContainsKey(i))
                    R[i] = new Dictionary<string, string>();
                foreach (string j in states)
                {
                    if (!R[i].ContainsKey(j))
                        R[i][j] = "";
                }
            }

            R[S][start] = "ε";

            foreach (var a in accepts)
                R[a][F] = "ε";

            Console.WriteLine("\nAfter adding S and F:");
            PrintRTable(R, states);

            var eliminationList = states.Where(s => s != S && s != F).ToList();
            Console.WriteLine($"\nElimination order: {string.Join(", ", eliminationList)}");


            foreach (var k in eliminationList)
            {
                Console.WriteLine($"\n--- Eliminating state {k} ---");
                string loop = R[k][k];
                Console.WriteLine($"Loop at {k}: {loop}");


                foreach (var i in states.Where(s => s != k))
                {
                    if (R[i][k] == "") continue;

                    foreach (var j in states.Where(s => s != k))
                    {
                        if (R[k][j] == "") continue;

                        string existing = R[i][j];
                        string ik = R[i][k];
                        string kj = R[k][j];

                        string newExp = Concat(ik, Star(loop), kj);
                        R[i][j] = Union(existing, newExp);

                        Console.WriteLine($"  {i} -> {j}: {existing} ∪ ({ik})({loop})* ({kj}) = {R[i][j]}");
                    }
                }

                foreach (string i in states)
                {
                    R[i][k] = "";
                    R[k][i] = "";
                }
            }

            Console.WriteLine($"\nfinal regex: {R[S][F]}");
            return CleanRegex(R[S][F]);
        }

        private void PrintRTable(Dictionary<string, Dictionary<string, string>> R, List<string> states)
        {
            foreach (var i in states)
            {
                foreach (var j in states)
                {
                    if (R[i][j] != "")
                        Console.WriteLine($" R[{i}][{j}] = {R[i][j]}");
                }
            }
        }
        private string Union(string a, string b)
        {
            if (string.IsNullOrEmpty(a)) return b;
            if (string.IsNullOrEmpty(b)) return a;
            if (a == b) return a;
            return $"({a}|{b})";
        }

        private string Concat(string a, string b)
        {
            if (string.IsNullOrEmpty(a)) return b;
            if (string.IsNullOrEmpty(b)) return a;
            if (a == "ε") return b;
            if (b == "ε") return a;
            return a + b;
        }

        private string Concat(string a, string b, string c)
        {
            return Concat(Concat(a, b), c);
        }

        private string Star(string a)
        {
            if (string.IsNullOrEmpty(a) || a == "ε")
                return "ε";

            return $"({a})*";
        }

        private string CleanRegex(string r)
        {
            if (string.IsNullOrEmpty(r)) return "";

            /* remove redundant parentheses
            r = System.Text.RegularExpressions.Regex.Replace(
                r, @"\(([^|()]+)\)", "$1"
            );

            /* simplify (a)* -> a*
            r = System.Text.RegularExpressions.Regex.Replace(
                r, @"\(([^()|]+?)\)\*", 
                m => m.Groups[1].Value.Length == 1 ? $"{m.Groups[1].Value}*" : m.Value
            );
            */
            return r;
        }

    }
}