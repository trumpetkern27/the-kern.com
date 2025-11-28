
using the_kern.com.Models;
using System.Text;

namespace the_kern.com.Services
{
    public class DFAAnalyzer
    {
        public DescribeLanguageResponse DescribeLanguage(DFA dfa)
        {
            var description = AnalysePatterns(dfa);
            var regex = AttemptRegexGeneration(dfa);

            return new DescribeLanguageResponse
            {
                Description = description,
                Regex = regex
            };
        }

        private string AnalysePatterns(DFA dfa)
        {
            var patterns = new List<string>();

            if (HasOnlyOneAcceptedState(dfa, out var acceptState))
            {
                if (AllPathsToAccept(dfa, acceptState))
                {
                    patterns.Add("All strings are accepted");
                }

                var incomingEdges = dfa.Edges.Where(e => e.To == acceptState.Id).ToList();
                if (incomingEdges.Any())
                {
                    var symbols = string.Join(", ", incomingEdges.Select(e => $"'{e.Symbol}"));
                    patterns.Add($"Strings ending with {symbols}");
                }
            }

            // check alphabet
            var alphabet = dfa.Edges.Select(e => e.Symbol).Distinct().OrderBy(s => s).ToList();
            patterns.Add($"Alphabet: {{{string.Join(", ", alphabet)}}}");

            // count states
            patterns.Add($"{dfa.Nodes.Count} states");

            return string.Join(". ", patterns);
        }

        private string AttemptRegexGeneration(DFA dfa)
        {
            var alphabet = dfa.Edges.Select(e => e.Symbol).Distinct().OrderBy( s=> s);
            var alphabetStr = string.Join("|", alphabet);

            return $"({alphabetStr})*";
        }

        private bool HasOnlyOneAcceptedState(DFA dfa, out DFANode acceptState)
        {
            var acceptStates = dfa.Nodes.Where( n => n.IsAccept).ToList();
            acceptState = acceptStates.FirstOrDefault();
            return acceptStates.Count == 1;
        }

        private bool AllPathsToAccept(DFA dfa, DFANode acceptState)
        {
            return false;
        }
    }
}