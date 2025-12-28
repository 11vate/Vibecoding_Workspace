"""
Setup script for DNA Annotation System
"""

from setuptools import setup, find_packages

setup(
    name="dna-annotation-system",
    version="0.1.0",
    description="Local-first DNA annotation system with strict layered architecture",
    packages=find_packages(),
    install_requires=[
        "pandas>=2.0.0",
        "numpy>=1.24.0",
        "aiohttp>=3.9.0",
        "aiofiles>=23.2.0",
        "beautifulsoup4>=4.12.0",
        "lxml>=4.9.0",
        "PyQt6>=6.6.0",
        "pydantic>=2.0.0",
        "tqdm>=4.66.0",
        "python-dotenv>=1.0.0",
    ],
    python_requires=">=3.10",
)









