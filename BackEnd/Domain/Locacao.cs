using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookApi.Domain
{
    public class Locacao
    {
        public int Id { get; set; }

        public string Id_Cliente { get; set; }

        public string Id_Filme { get; set; }

        public DateTime DataLocacao { get; set; }

        public DateTime? DataDevolucao { get; set; }
    }
}
