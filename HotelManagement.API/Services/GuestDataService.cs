using HotelManagement.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HotelManagement.API.Services
{
    public static class GuestDataService
    {
        private static readonly Random _random = new Random();
        
        private static readonly List<string> FirstNames = new()
        {
            "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
            "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
            "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
            "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
            "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
            "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
            "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
            "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
            "Frank", "Angela", "Nicholas", "Helen", "Eric", "Brenda", "Jonathan", "Emma",
            "Oliver", "Sophia", "Alexander", "Isabella", "Ethan", "Charlotte", "Lucas", "Amelia"
        };

        private static readonly List<string> LastNames = new()
        {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
            "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
            "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
            "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
            "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
            "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
            "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
            "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
            "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson"
        };

        private static readonly List<string> EmailDomains = new()
        {
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
            "mail.com", "protonmail.com", "aol.com", "live.com", "yandex.com",
            "fastmail.com", "zoho.com", "gmx.com", "tutanota.com", "mail.ru"
        };

        private static readonly List<string> CountryCodes = new()
        {
            "1",   // USA/Canada
            "44",  // UK
            "33",  // France
            "49",  // Germany
            "39",  // Italy
            "34",  // Spain
            "81",  // Japan
            "86",  // China
            "91",  // India
            "61",  // Australia
            "55",  // Brazil
            "52",  // Mexico
            "31",  // Netherlands
            "46",  // Sweden
            "47"   // Norway
        };

        public static List<CreateGuestDto> GenerateRandomGuests(int count)
        {
            var guests = new List<CreateGuestDto>();
            var usedEmails = new HashSet<string>();

            for (int i = 0; i < count; i++)
            {
                var firstName = FirstNames[_random.Next(FirstNames.Count)];
                var lastName = LastNames[_random.Next(LastNames.Count)];
                var name = $"{firstName} {lastName}";
                
                // Generate unique email
                string email;
                do
                {
                    var emailPrefix = $"{firstName.ToLower()}.{lastName.ToLower()}{_random.Next(1, 999)}";
                    var domain = EmailDomains[_random.Next(EmailDomains.Count)];
                    email = $"{emailPrefix}@{domain}";
                } while (usedEmails.Contains(email));
                
                usedEmails.Add(email);

                // Generate phone number
                var countryCode = CountryCodes[_random.Next(CountryCodes.Count)];
                var phoneNumber = $"+{countryCode}-{_random.Next(100, 999)}-{_random.Next(100, 999)}-{_random.Next(1000, 9999)}";

                guests.Add(new CreateGuestDto
                {
                    Name = name,
                    Email = email,
                    Phone = phoneNumber
                });
            }

            return guests;
        }

        public static List<CreateGuestDto> GetPremiumGuests()
        {
            return new List<CreateGuestDto>
            {
                new CreateGuestDto
                {
                    Name = "Alexander Hamilton",
                    Email = "a.hamilton@executive.com",
                    Phone = "+1-555-100-0001"
                },
                new CreateGuestDto
                {
                    Name = "Victoria Sterling",
                    Email = "v.sterling@corporate.com",
                    Phone = "+44-20-7100-0002"
                },
                new CreateGuestDto
                {
                    Name = "Maximilian Berg",
                    Email = "m.berg@business.de",
                    Phone = "+49-30-8100-0003"
                },
                new CreateGuestDto
                {
                    Name = "Isabella Rossi",
                    Email = "i.rossi@luxury.it",
                    Phone = "+39-06-9100-0004"
                },
                new CreateGuestDto
                {
                    Name = "Chen Wei",
                    Email = "chen.wei@enterprise.cn",
                    Phone = "+86-10-8100-0005"
                },
                new CreateGuestDto
                {
                    Name = "Sophie Dubois",
                    Email = "s.dubois@premier.fr",
                    Phone = "+33-1-7100-0006"
                },
                new CreateGuestDto
                {
                    Name = "Raj Patel",
                    Email = "r.patel@tech.in",
                    Phone = "+91-22-9100-0007"
                },
                new CreateGuestDto
                {
                    Name = "Maria Silva",
                    Email = "m.silva@business.br",
                    Phone = "+55-11-9100-0008"
                },
                new CreateGuestDto
                {
                    Name = "James Mitchell",
                    Email = "j.mitchell@vip.au",
                    Phone = "+61-2-9100-0009"
                },
                new CreateGuestDto
                {
                    Name = "Elena Volkov",
                    Email = "e.volkov@premium.ru",
                    Phone = "+7-495-100-0010"
                }
            };
        }

        public static List<CreateGuestDto> GetBusinessGuests()
        {
            return new List<CreateGuestDto>
            {
                new CreateGuestDto
                {
                    Name = "Robert Thompson",
                    Email = "r.thompson@techcorp.com",
                    Phone = "+1-415-555-2001"
                },
                new CreateGuestDto
                {
                    Name = "Sarah Johnson",
                    Email = "s.johnson@globalbank.com",
                    Phone = "+1-212-555-2002"
                },
                new CreateGuestDto
                {
                    Name = "Michael Chen",
                    Email = "m.chen@consulting.com",
                    Phone = "+1-650-555-2003"
                },
                new CreateGuestDto
                {
                    Name = "Emma Williams",
                    Email = "e.williams@lawfirm.com",
                    Phone = "+1-312-555-2004"
                },
                new CreateGuestDto
                {
                    Name = "David Kumar",
                    Email = "d.kumar@startup.io",
                    Phone = "+1-408-555-2005"
                },
                new CreateGuestDto
                {
                    Name = "Lisa Anderson",
                    Email = "l.anderson@media.com",
                    Phone = "+1-310-555-2006"
                },
                new CreateGuestDto
                {
                    Name = "Thomas Mueller",
                    Email = "t.mueller@automotive.de",
                    Phone = "+49-89-555-2007"
                },
                new CreateGuestDto
                {
                    Name = "Anna Petrov",
                    Email = "a.petrov@energy.com",
                    Phone = "+7-495-555-2008"
                },
                new CreateGuestDto
                {
                    Name = "Carlos Rodriguez",
                    Email = "c.rodriguez@retail.es",
                    Phone = "+34-91-555-2009"
                },
                new CreateGuestDto
                {
                    Name = "Yuki Tanaka",
                    Email = "y.tanaka@tech.jp",
                    Phone = "+81-3-555-2010"
                }
            };
        }

        public static List<CreateGuestDto> GetLeisureGuests()
        {
            return new List<CreateGuestDto>
            {
                new CreateGuestDto
                {
                    Name = "Jennifer Brown",
                    Email = "jenny.brown@gmail.com",
                    Phone = "+1-555-333-4001"
                },
                new CreateGuestDto
                {
                    Name = "Mark Wilson",
                    Email = "mark.wilson2024@yahoo.com",
                    Phone = "+1-555-333-4002"
                },
                new CreateGuestDto
                {
                    Name = "Amanda Taylor",
                    Email = "amanda.t@hotmail.com",
                    Phone = "+1-555-333-4003"
                },
                new CreateGuestDto
                {
                    Name = "Christopher Lee",
                    Email = "chris.lee88@gmail.com",
                    Phone = "+1-555-333-4004"
                },
                new CreateGuestDto
                {
                    Name = "Jessica Martinez",
                    Email = "jess.martinez@outlook.com",
                    Phone = "+1-555-333-4005"
                },
                new CreateGuestDto
                {
                    Name = "Daniel White",
                    Email = "daniel.white@icloud.com",
                    Phone = "+1-555-333-4006"
                },
                new CreateGuestDto
                {
                    Name = "Michelle Garcia",
                    Email = "michelle.g@gmail.com",
                    Phone = "+1-555-333-4007"
                },
                new CreateGuestDto
                {
                    Name = "Ryan Davis",
                    Email = "ryan.davis2024@mail.com",
                    Phone = "+1-555-333-4008"
                },
                new CreateGuestDto
                {
                    Name = "Ashley Robinson",
                    Email = "ashley.r@protonmail.com",
                    Phone = "+1-555-333-4009"
                },
                new CreateGuestDto
                {
                    Name = "Kevin Clark",
                    Email = "kevin.clark@fastmail.com",
                    Phone = "+1-555-333-4010"
                }
            };
        }

        public static List<CreateGuestDto> GetAllSampleGuests()
        {
            var allGuests = new List<CreateGuestDto>();
            allGuests.AddRange(GetPremiumGuests());
            allGuests.AddRange(GetBusinessGuests());
            allGuests.AddRange(GetLeisureGuests());
            return allGuests;
        }
    }
}
