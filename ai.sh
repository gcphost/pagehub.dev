
## make data
openai tools fine_tunes.prepare_data -f ./train.jsonl


########## create fine tune
openai api fine_tunes.create -t "./train_prepared.jsonl" -m davinci
########



#### wait for it tto reutnr get fined_tuned_model
openai api fine_tunes.list

ft-cax9o1GnsOws1Ddch0KGozt8


openai api fine_tunes.get -i ft-cax9o1GnsOws1Ddch0KGozt8

openai api fine_tunes.cancel -i