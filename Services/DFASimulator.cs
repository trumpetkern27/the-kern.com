using System.Collections;
using System.ComponentModel;
using the_kern.com.Models;

namespace the_kern.com.Services
{
    public class DFASimulator
    {
        public TestStringResponse SimulateString(DFA dfa, string input)
        {
            //build transition tabls
            var transitions = BuildTransitionTable(dfa);

            //find start state
            var currentState = dfa.Nodes.FirstOrDefault(n => n.IsStart);
            if (currentState == null)
            {
                return new TestStringResponse
                {
                    Accepted = false,
                    Path = new List<string>(),
                    Reason = "No start state defined"
                };
            }

            var path = new List<string> { currentState.Id };

            // process each symbol
            foreach (var symbol in input)
            {
                var key = $"{currentState.Id}_{symbol}";

                if (!transitions.ContainsKey(key))
                {
                    return new TestStringResponse
                    {
                        Accepted = false,
                        Path = path,
                        Reason = $"No transition from {currentState.Id} on symbol '{symbol}'"
                    };
                }

                currentState = transitions[key];
                path.Add(currentState.Id);
            }

            // check if ended in accept state
            var accepted = currentState.IsAccept;

            return new TestStringResponse
            {
                Accepted = accepted,
                Path = path,
                Reason = accepted
                    ? "String accepted - ended in accept state"
                    : $"String rejected - ended in non-accepted state {currentState.Id}"
            };
        }

        private Dictionary<string, DFANode> BuildTransitionTable(DFA dfa)
        {
            var table = new Dictionary<string, DFANode>();
            foreach (var edge in dfa.Edges)
            {
                var fromNode = dfa.Nodes.First(n => n.Id == edge.From);
                var toNode = dfa.Nodes.First(n => n.Id == edge.To);

                var key = $"{edge.From}_{edge.Symbol}";
                table[key] = toNode;
            }

            return table;
        }
    }
}