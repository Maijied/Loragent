from setuptools import setup

setup(
    name='loragent',
    version='2.0.0',
    description='Universal Multi-Agent Ecosystem for Lorapok Labs — 224 Autonomous Agents, 20 MCP Servers, and 6 Formations',
    long_description=open('README.md', encoding='utf-8').read() if open('README.md', encoding='utf-8') else '',
    long_description_content_type='text/markdown',
    author='Lorapok Labs',
    author_email='lorapokdev@gmail.com',
    url='https://loragent.lorapok.tech',
    project_urls={
        'Homepage': 'https://loragent.lorapok.tech',
        'Repository': 'https://github.com/Maijied/Loragent',
        'Issues': 'https://github.com/Maijied/Loragent/issues',
    },
    packages=['loragent'],
    entry_points={
        'console_scripts': [
            'loragent=loragent.cli:main',
            'loragent-install=loragent.installer:main',
            'install-officers=loragent.installer:main',
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python :: 3.12',
        'Operating System :: OS Independent',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
    ],
    python_requires='>=3.8',
)
