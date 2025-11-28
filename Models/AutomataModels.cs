using System.ComponentModel;

namespace the_kern.com.Models
{
    public class DFANode
    {
        public string Id { get; set; }
        public bool IsStart { get; set; }
        public bool IsAccept { get; set; }
    }

    public class DFAEdge
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Symbol { get; set; } 
    }

    public class DFA
    {
        public List<DFANode> Nodes { get; set; }
        public List<DFAEdge> Edges { get; set; }

    }

    public class TestStringRequest
    {
        public DFA Dfa { get; set; }
        public string Input { get; set; }
    }

    public class TestStringResponse
    {
        public bool Accepted { get; set; }
        public List<string> Path { get; set; }
        public string Reason { get; set; }
    }

    public class DescribeLanguageRequest
    {
        public DFA Dfa { get; set; }
    }

    public class DescribeLanguageResponse
    {
        public string Description { get; set; }
        public string Regex { get; set; }
    }
}