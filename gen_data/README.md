## Generates Student Transaction Data from 08/01 - 05/31

### student_behavior.json
Contains fields to describe a students transaction habits
Attributes:
- `"starting_amount"`: Amount of spendable money a student has on 08/01
- `"avg_daily_spend"`: How much does a student spend daily on average? Think coffee, food, or groceries.
- `"std_daily_spend"`: Standard deviation of daily spend. Included to show 
- `"add_reoccuring_pay"`: list of recurring playments. Think any subscriptions, . If there is any recurring income, specifiy the income amount as negative.
- `"freq_of_pay"`: Corresponds to how often the correspnding reoccuring pay happens.
Example:
`"add_reoccuring_pay"`: [12, -120],
`"freq_of_pay"`: [30, 14]
The above means the user pays $12 every 30 days, and receives $120 every 14 days

- `"avg_rand_add_pay"`, `"std_rand_add_pay"`, and `"rand_add_pay_occur"`. <br>
There are instances where a student may need to randomly and abrutly spend more than what they usually do. We consider this a seperate distribution. Think going to the doctor, paying for a parking ticket. "rand_add_pay_occur" indicates how many days over the [08/01 - 05/31] period these random spendings should occur.

- `"avg_rand_income"`, `"std_rand_income"`, `"rand_income_occur"` <br>
Same logic is applied to random instances of income. Think a birthday gift or the student won some competition.

### template.json
This is includes all non-transaction data accounts you want the user to include. The script gen_data.py simply adds 245 entries to the "transactions" entry in the template.

### gen_data.py
Actually generates the data in a json file. If you want to also plot the data you can use the `-p` flag. <br>
`Usage: python3 gen_data.py -f <filename.json> [-p]`