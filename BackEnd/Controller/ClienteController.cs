using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BookApi.Repository;
using BookApi.Domain;
using BookApi.Data;
using System.Net.Http;
using Newtonsoft.Json;
using RestSharp;
using Newtonsoft.Json.Linq;

namespace BookApi.Controller
{
    [Route("api/cliente")]
    [ApiController]
    public class ClienteController : ControllerBase
    {

        [HttpGet]
        [Route("GetCliente/{BookTitle}")]
        public async Task<List<Cliente>> GetCliente([FromServices] DataContext context, [FromRoute]string BookTitle)
        {

            //HttpClient client = new HttpClient();
            //client.BaseAddress = new Uri("http://localhost:61190/");

            //var response = client.GetByteArrayAsync("https://www.googleapis.com/books/v1/volumes?q=" + BookTitle).Result;


            //var teste =  Ok(JsonConvert.SerializeObject(response));

            var client = new RestClient("https://www.googleapis.com/books/v1/volumes?q=" + BookTitle);
            var request = new RestRequest(Method.GET);
            IRestResponse response = await client.ExecuteAsync(request);
            if (response.IsSuccessful)
            {
                var content = JsonConvert.DeserializeObject<JToken>(response.Content);

                //Get the league caption
                var leagueCaption = content["leagueCaption"].Value<string>();

                //Get the standings for the league.
                //var rankings = content.SelectTokens("standing[*]")
                //    .Select(team => new StandingModel
                //    {
                //        TeamName = (string)team["teamName"],
                //        Position = (int)team["position"]
                //    })
                //    .ToList();

                //return the model to my caller.
                //return new LeagueTableModel
                //{
                //    LeagueCaption = leagueCaption,
                //    Standings = rankings
                //};
            }

            //if (response.IsSuccessStatusCode)
            //{
            //    Console.WriteLine("Request Message Information:- \n\n" + response.RequestMessage + "\n");
            //    Console.WriteLine("Response Message Header \n\n" + response.Content.Headers + "\n");
            //}
            //else
            //{
            //    Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
            //}
            //Console.ReadLine();


            return null;
        }


    }
}