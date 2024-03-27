import numpy as np
from datetime import datetime, timedelta
import json
import argparse


def create_transactions(starting_amount, avg_daily_spend, std_daily_spend, add_reoccuring_pay, freq_of_pay, avg_rand_add_pay,
  std_rand_add_pay, rand_add_pay_occur, avg_rand_income, std_rand_income, rand_income_occur, filename="", plot=False):
  WEEKS = 35
  DAYS = WEEKS * 7

  start_dates = [datetime(2023, 8, 1) + timedelta(days=i) for i in range(DAYS)]
  #end_dates = [datetime(2023, 8, 1) + timedelta(days=6, hours=23, minutes=59, seconds=59) + timedelta(days=7*i) for i in range(WEEKS) ]


  indx = np.arange(DAYS)
  np.random.shuffle(indx)
  indx_add_pay = indx[:rand_add_pay_occur]
  indx_income = indx[rand_add_pay_occur : rand_income_occur+rand_add_pay_occur]

  #Avg spending
  spendings = np.random.normal(avg_daily_spend, std_daily_spend, DAYS)
  spendings = np.clip(spendings, 0, np.inf)

  #Apply random extra spendings (car towed, medical, etc.)
  aribtrary_expenses = np.random.normal(avg_rand_add_pay, std_rand_add_pay, rand_add_pay_occur)
  spendings[indx_add_pay] += aribtrary_expenses 

  #Apply random instances of income
  if rand_income_occur > 0:
    spendings[indx_income] -= np.random.normal(avg_rand_income, std_rand_income, rand_income_occur)


  #Apply any subscriptions (rent, netflix, or fixed income (negative))
  for freq, pay in zip(freq_of_pay, add_reoccuring_pay):
    ix = [i for i in range(DAYS) if i%freq==0]
    spendings[ix] += pay


  #Accumulate
  # spendings[0] = starting_amount - spendings[0]

  # for i in range(1, DAYS):
  #   spendings[i] = spendings[i-1] - spendings[i]


  spendings = np.clip(spendings, 0, np.inf)

  if filename:
    temp = json.loads(open("template.json", "r").read())
    n = len(spendings)
    for i, (start, spent) in enumerate(zip(start_dates, spendings)):
      #print(f"Complete {i/n*100:.2f}%...", end="\r")
      entry ={
        "date_transacted": str(start).split(" ")[0],
        "date_posted": str(start).split(" ")[0],
        "currency": "USD",
        "amount": spent,
        "description": "Custom Transaction"
      }
      temp["override_accounts"][1]["transactions"].append(entry)
    #print()
    json_object = json.dumps(temp, indent=4)
 
  # Writing to sample.json
  with open(filename, "w") as outfile:
    outfile.write(json_object)
      

  if plot:
    import matplotlib.pyplot as plt
    plt.style.use('fivethirtyeight')

    def plot(dates, amt):
      plt.plot(dates, amt)
      plt.xticks(rotation=45)
      plt.xlabel("Date")
      plt.ylabel("Spending Money ($)")
      plt.title("Trend of Student Spending from 8/1 - 5/31")
      plt.show()


    plot(start_dates,spendings)


def main():

  parser = argparse.ArgumentParser(
                    prog='gen_data',
                    description='Generates Student Transaction Data'
                    )

  parser.add_argument('-f', '--filename', default="")
  parser.add_argument('-p', '--plot',
                      action='store_true')
  args = parser.parse_args()
  filename = args.filename
  plot = args.plot

  student_behavior = json.loads(open("student_behavior.json", "rb").read())
  create_transactions(**student_behavior, filename=filename, plot=plot)

if __name__ == "__main__":
  main()