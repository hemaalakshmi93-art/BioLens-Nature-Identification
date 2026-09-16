BioLens – AI-Powered Nature Identification & Discovery

Discover. Identify. Learn.

BioLens is a web-based nature identification and discovery platform designed to help users identify unfamiliar elements of nature using images.

The prototype focuses on five categories:

-  Flowers
-  Trees
-  Leaves
-  Insects
-  Birds

## Problem

People encounter many flowers, trees, leaves, insects, and birds in their daily surroundings but may not know what they are or how to find useful information about them.

Manual searching can be time-consuming, and information may not always be presented in a simple or accessible way. BioLens aims to make nature identification and learning easier through a simple image-based interface with bilingual information.

## Solution

BioLens allows users to:

1. Upload or capture an image.
2. Identify the natural object using the prototype identification system.
3. View its English, Tamil, and scientific names.
4. View useful information about the identified species.
5. Save the discovery to their personal collection.
6. Explore saved discoveries through a Discovery Map.

## Key Features

### Image Identification
Users can upload an image and preview it before starting identification.

### Nature Identification
The current prototype supports five categories:
Flowers, Trees, Leaves, Insects, and Birds.

### Species Information
Identification results include:

- English name
- Tamil name
- Scientific name
- Confidence score
- About
- Uses
- Ecological importance
- Safety information
- Similar species

### My Discoveries
Users can save identified species and maintain a personal collection of their nature discoveries.

### Discovery Map
Saved discoveries can be explored geographically through the Discovery Map.

## Prototype Workflow

**Upload → Identify → Learn → Save → Explore**

## Technology

The current prototype is implemented as a modern web application using:

- TypeScript
- React
- Vite
- HTML/CSS
- Browser-based storage
- Map-based visualization

## Current AI/Identification Approach

This repository contains the current prototype implementation of BioLens.

The present identification functionality is designed for demonstrating the complete user experience and workflow. The confidence scores shown in the prototype are demonstration values and should not be interpreted as scientifically validated probabilities.

A future version can integrate a trained computer vision model such as a CNN, Vision Transformer, or another suitable image-classification model.

## Prototype Validation

The prototype was tested with three users.

Initial feedback highlighted:

- Clean and user-friendly interface.
- Quick understanding of the application's purpose.
- Simple identification workflow.
- Usefulness of bilingual information.
- Interest in expanding supported nature observations.
- Need for clearer explanation of the Discovery Map.
- Need for deeper educational information such as habitat and uses.

These observations will guide future iterations of BioLens.

## Future Improvements

Planned improvements include:

- Integration of a trained AI image-identification model.
- Larger and more diverse species dataset.
- Improved identification accuracy.
- Support for additional species and nature categories.
- Richer educational information.
- Improved discovery persistence and user management.
- More extensive usability testing.
- Systematic accuracy evaluation.

## Project Status

**Current Stage: Prototype / Review 1**

The core BioLens workflow and major interface modules have been implemented and demonstrated.

The project will continue to evolve toward a more advanced AI-powered nature identification platform.

## Vision

BioLens aims to make discovering and learning about nature simple, accessible, and engaging.

**Discover. Identify. Learn.**
