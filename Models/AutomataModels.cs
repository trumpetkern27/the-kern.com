using System.ComponentModel;
using System.Text.Json.Serialization;

namespace the_kern.com.Models
{
    
    public class DFANode
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("isStart")]
        public bool isStart { get; set; }
        [JsonPropertyName("isAccept")]
        public bool isAccept { get; set; }
    }

    public class DFAEdge
    {
        [JsonPropertyName("from")]
        public string From { get; set; }
        [JsonPropertyName("to")]
        public string To { get; set; }
        [JsonPropertyName("symbol")]
        public string Symbol { get; set; } 
    }

    public class DFA
    {
        [JsonPropertyName("nodes")]
        public List<DFANode> Nodes { get; set; }
        [JsonPropertyName("edges")]
        public List<DFAEdge> Edges { get; set; }

    }

    public class TestStringRequest
    {
        [JsonPropertyName("dfa")]
        public DFA Dfa { get; set; }
        [JsonPropertyName("input")]
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
        [JsonPropertyName("dfa")]
        public DFA Dfa { get; set; }
    }

    public class DescribeLanguageResponse
    {
        public string Description { get; set; }
        public string Regex { get; set; }
    }
}