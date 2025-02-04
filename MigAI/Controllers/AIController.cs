using Microsoft.AspNetCore.Mvc;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using System.Linq;

[Route("api/ai")]
[ApiController]
public class AIController : ControllerBase
{
    private readonly InferenceSession _session;

    public AIController()
    {
        _session = new InferenceSession("model.onnx");
    }

    public class KeypointsRequest
    {
        public float[][][] Keypoints { get; set; } = Array.Empty<float[][]>();
    }

    [HttpPost("predict")]
    public IActionResult Predict([FromBody] KeypointsRequest request)
    {
        if (request.Keypoints == null || request.Keypoints.Length == 0)
            return BadRequest("Brak danych wejściowych!");

        int batchSize = request.Keypoints.Length;
        int sequenceLength = request.Keypoints[0].Length;
        int featureSize = request.Keypoints[0][0].Length; 

        if (sequenceLength != 30 || featureSize != 1662)
            return BadRequest("Nieprawidłowy format danych!");

        var inputTensor = new DenseTensor<float>(
            request.Keypoints.SelectMany(batch => batch.SelectMany(frame => frame)).ToArray(),
            new[] { batchSize, sequenceLength, featureSize }
        );

        var inputs = new List<NamedOnnxValue> { NamedOnnxValue.CreateFromTensor("input", inputTensor) };
        var results = _session.Run(inputs).FirstOrDefault();

        if (results == null) return BadRequest("Błąd modelu AI!");

        var output = results.AsEnumerable<float>().ToArray();
        int predictedIndex = Array.IndexOf(output, output.Max());

        var labels = new[] { "Cześć", "Dziękuję", "Przepraszam" };
        return Ok(new { predictedSign = labels[predictedIndex] });
    }

}
