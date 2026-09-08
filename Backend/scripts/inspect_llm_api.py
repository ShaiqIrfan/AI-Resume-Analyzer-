import inspect
from langchain_google_genai import ChatGoogleGenerativeAI

print('ChatGoogleGenerativeAI class:', ChatGoogleGenerativeAI)
members = [m for m in dir(ChatGoogleGenerativeAI) if not m.startswith('_')]
print('members count:', len(members))
print('\nMethods containing structured/output/schema/parser:')
for m in members:
    if any(k in m for k in ('structured','output','schema','parser')):
        print('-', m)

# show whether with_structured_output present
print('\nHas with_structured_output:', hasattr(ChatGoogleGenerativeAI, 'with_structured_output'))
print('Has with_output_parser:', hasattr(ChatGoogleGenerativeAI, 'with_output_parser'))
print('Has with_response_schema:', hasattr(ChatGoogleGenerativeAI, 'with_response_schema'))

# print signatures if present
for name in ('with_structured_output','with_output_parser','with_response_schema'):
    if hasattr(ChatGoogleGenerativeAI, name):
        print('\nSignature for', name, ':', inspect.signature(getattr(ChatGoogleGenerativeAI, name)))
