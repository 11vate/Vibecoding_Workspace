# Layered Sprite Generation System (4-Layer Compositing)

## Overview
This document details the Layered Sprite Generation System for Pixel Pets Reborn X Remerged. The system uses a 4-layer compositing approach to create visually rich, unique sprites that reflect the pet's family, elements, fusion history, and visual mutations. Each layer contributes specific visual aspects while maintaining visual consistency and performance.

## System Architecture

### Core Concept
The layered system separates sprite generation into four distinct layers, each representing a different aspect of the pet's identity:
1. **Core Body Shape** - Basic structure and form
2. **Element Overlay** - Elemental visual effects and properties
3. **Family Trait** - Family-specific features and characteristics
4. **Fusion Mutation** - Fusion-specific modifications and visual mutations

### Technical Foundation
- **Resolution**: 64x64 base resolution, with option to scale to 128x128
- **Format**: PNG data URLs with alpha channel support
- **Color Depth**: 256-color palette with dithering for smooth gradients
- **Animation**: Support for multi-frame sprites (typically 4-8 frames)
- **Deterministic**: Seeded randomization for reproducible results

## Layer System Design

### Layer 1: Core Body Shape

#### Purpose
The fundamental structure that defines the pet's basic form and silhouette.

#### Characteristics
- **Resolution**: 64x64 pixels (base), 128x128 (enhanced)
- **Color Palette**: Family-specific primary colors
- **Shape Types**: Predefined templates (circle, square, oval, blob, diamond, custom)
- **Outline**: 1-pixel solid outline for pixel art clarity
- **Internal Detail**: Basic internal structure, organs, etc.

#### Generation Process
1. **Select Shape Template**: Choose from predefined family-appropriate shapes
2. **Apply Family Palette**: Use colors specific to pet family
3. **Add Basic Structure**: Internal details based on family type
4. **Apply Outline**: Add solid outline for clarity
5. **Save as Layer**: Store as indexed color palette image

#### Shape Categories by Family
- **PYRO_KIN**: Angular, dynamic shapes; flame-like forms
- **AQUA_BORN**: Flowing, liquid shapes; organic curves
- **TERRA_FORGED**: Solid, geometric shapes; crystalline forms
- **VOLT_STREAM**: Sharp, energetic shapes; lightning-inspired
- **SHADOW_VEIL**: Undefined, shifting shapes; ethereal forms
- **LUMINA**: Clean, geometric shapes; radiant forms
- **STEEL_WORKS**: Mechanical, industrial shapes; angular precision
- **ARCANE_RIFT**: Complex, mystical shapes; geometric complexity
- **AERO_FLIGHT**: Light, flowing shapes; aerodynamic forms
- **WEIRDOS**: Chaotic, unpredictable shapes; variable forms

### Layer 2: Element Overlay

#### Purpose
Visual representation of elemental properties and characteristics.

#### Characteristics
- **Particle Effects**: Element-specific visual particles and effects
- **Color Gradients**: Smooth transitions for elemental properties
- **Animation Frames**: Multiple frames for animated effects
- **Blend Modes**: Multiply, screen, overlay for visual integration
- **Intensity Maps**: Grayscale maps controlling effect strength

#### Generation Process
1. **Identify Elements**: Determine from parent elements and fusion
2. **Select Particle Sets**: Choose appropriate particle effects
3. **Generate Animations**: Create multiple frames for animation
4. **Apply Blend Modes**: Integrate with core layer appropriately
5. **Adjust Intensity**: Based on element strength in pet
6. **Save as Layer**: Store with transparency for compositing

#### Element-Specific Effects

**Fire Effects**:
- **Flame Particles**: Dynamic flame particles with physics
- **Heat Distortion**: Subtle distortion effect
- **Glow Effects**: Radiating heat glow
- **Ember Sprites**: Scattered ember particles
- **Color Gradients**: Red-orange-yellow heat gradients

**Water Effects**:
- **Droplet Particles**: Floating water droplets
- **Wave Patterns**: Flowing wave animations
- **Ripple Effects**: Dynamic ripple patterns
- **Bubble Sprites**: Floating air bubbles
- **Color Gradients**: Blue-cyan-turquoise flowing gradients

**Earth Effects**:
- **Crystal Sprites**: Geometric crystal formations
- **Rock Particles**: Floating rock and stone particles
- **Moss Patterns**: Organic moss and growth patterns
- **Soil Sprites**: Earth and dirt particle effects
- **Color Gradients**: Brown-green-gray earth gradients

**Lightning Effects**:
- **Electric Particles**: Dynamic electric sparks
- **Bolt Patterns**: Lightning bolt animations
- **Glow Effects**: Electrical field glow
- **Spark Sprites**: Random electrical spark effects
- **Color Gradients**: Yellow-cyan-white electric gradients

**Shadow Effects**:
- **Void Particles**: Dark void-like particles
- **Shadow Patterns**: Flowing shadow animations
- **Glow Suppression**: Dark areas that absorb light
- **Smokelike Sprites**: Ethereal smoke and shadow effects
- **Color Gradients**: Purple-black-dark blue shadow gradients

**Light Effects**:
- **Ray Particles**: Radiating light beam particles
- **Glow Patterns**: Pulsing light animations
- **Radiance Effects**: Pure light radiating patterns
- **Sparkle Sprites**: Twinkling light particles
- **Color Gradients**: White-gold-yellow radiant gradients

**Metal Effects**:
- **Polish Patterns**: Metallic shine and reflection patterns
- **Gear Sprites**: Mechanical gear and cog animations
- **Reflection Effects**: Mirror-like surface reflections
- **Scratch Sprites**: Realistic metal scratch and wear effects
- **Color Gradients**: Gray-silver-blue metallic gradients

**Magic Effects**:
- **Runes**: Floating magical rune patterns
- **Spell Particles**: Arcane energy particles
- **Mystical Patterns**: Ethereal magical animations
- **Enchantment Sprites**: Glowing magical effect particles
- **Color Gradients**: Purple-magenta-magenta magical gradients

**Air Effects**:
- **Wind Particles**: Flowing wind stream particles
- **Cloud Patterns**: Light, flowing cloud animations
- **Current Effects**: Air current visualization
- **Breeze Sprites**: Gentle, flowing air effects
- **Color Gradients**: Light blue-white-airy gradients

**Chaos Effects**:
- **Glitch Particles**: Digital glitch and corruption effects
- **Random Patterns**: Unpredictable, chaotic animations
- **Mutation Effects**: Visual mutation and transformation patterns
- **Instability Sprites**: Constantly changing visual effects
- **Color Gradients**: All colors shifting and changing

### Layer 3: Family Trait

#### Purpose
Family-specific features, accessories, and characteristic visual elements.

#### Characteristics
- **Family Features**: Family-specific body parts (wings, horns, tails, etc.)
- **Accessories**: Family-appropriate decorations and accessories
- **Pattern Details**: Family-specific textures and patterns
- **Shape Modifications**: Family-specific body modifications
- **Color Accents**: Family accent colors for visual identity

#### Generation Process
1. **Determine Family**: Based on fusion results and inheritance
2. **Select Feature Types**: Choose appropriate family features
3. **Apply Pattern Details**: Add family-specific textures
4. **Select Accessories**: Add family-appropriate accessories
5. **Apply Color Accents**: Use family accent color palette
6. **Save as Layer**: Store with transparency for compositing

#### Family-Specific Traits

**PYRO_KIN Traits**:
- **Horns**: Flaming horns with constant flame effect
- **Flames**: Permanent flames on tips of ears/horns
- **Scorch Marks**: Subtle burn marks for character
- **Ember Glow**: Internal ember glow effects
- **Flame Tail**: Tail that burns with controlled flame

**AQUA_BORN Traits**:
- **Fins**: Flowing fins that move with water current
- **Gills**: Visible gill structures for breathing
- **Water Drops**: Constantly shedding water drops
- **Scales**: Shimmering fish-like scales
- **Flowing Hair**: Hair that moves like flowing water

**TERRA_FORGED Traits**:
- **Crystals**: Crystal protrusions from body
- **Stone Plates**: Protective stone armor plating
- **Rocky Texture**: Rough stone texture details
- **Mineral Veins**: Shining mineral deposits
- **Geometric Patterns**: Crystalline growth patterns

**VOLT_STREAM Traits**:
- **Spikes**: Electrically conductive spikes
- **Circuits**: Visible circuit patterns on skin
- **Lightning Bolt**: Iconic lightning bolt markings
- **Energy Cores**: Visible energy storage areas
- **Conductors**: Metallic conductor elements

**SHADOW_VEIL Traits**:
- **Void Orbs**: Dark void spheres floating near pet
- **Shadow Cloak**: Ethereal shadowy cloak effect
- **Glowing Eyes**: Bright eyes that pierce darkness
- **Phantom Limbs**: Semi-transparent additional limbs
- **Dark Veil**: Flowing dark energy patterns

**LUMINA Traits**:
- **Halo**: Radiant light halo effect
- **Angel Wings**: Ethereal angelic wings
- **Glowing Markings**: Holy light markings
- **Celestial Patterns**: Star and constellation patterns
- **Pure Form**: Clean, pure geometric shapes

**STEEL_WORKS Traits**:
- **Mechanical Parts**: Exposed gears and mechanical components
- **Joints**: Visible mechanical joints and connections
- **Pipes**: Conduit pipes for energy/liquid transport
- **Plating**: Metal armor plating with rivets
- **Industrial Markings**: Serial numbers and status indicators

**ARCANE_RIFT Traits**:
- **Runes**: Mystical runes floating around pet
- **Spell Circles**: Temporary magical circle formations
- **Energy Cores**: Mystical energy storage areas
- **Mystical Accessories**: Magical staffs, amulets, etc.
- **Arcane Patterns**: Mystical energy flow patterns

**AERO_FLIGHT Traits**:
- **Wings**: Functional wings for flight
- **Wind Currents**: Visible air current patterns
- **Feathers**: Light, aerodynamic feather patterns
- **Aerodynamic Shape**: Streamlined body modifications
- **Flight Markings**: Airflow visualization patterns

**WEIRDOS Traits**:
- **Glitch Effects**: Visual glitch and data corruption
- **Mutation Features**: Randomly changing body parts
- **Chaos Patterns**: Unpredictable, constantly changing patterns
- **Instability**: Visual effects showing chaotic nature
- **Paradox Form**: Impossible geometric shapes

### Layer 4: Fusion Mutation

#### Purpose
Fusion-specific modifications that reflect the fusion process and history.

#### Characteristics
- **Visual Mutations**: Fusion-specific visual changes
- **Glitch Effects**: For glitched fusions
- **Scars**: Fusion "scars" showing where elements merged
- **Mutation Patterns**: Random mutation effects
- **Inheritance Marks**: Visual marks showing parent inheritance

#### Generation Process
1. **Analyze Fusion**: Determine fusion-specific mutations
2. **Apply Mutation Effects**: Add fusion-specific changes
3. **Add Inheritance Marks**: Visual indicators of parents
4. **Apply Glitch Effects**: For glitched fusion pets
5. **Add Fusion Scars**: Visual fusion "wounds" that show merging
6. **Save as Layer**: Store with transparency for compositing

#### Mutation Categories

**Minor Mutations**:
- **Color Shifts**: Subtle color variations from fusion
- **Size Modifications**: Small changes in body proportions
- **Pattern Changes**: Minor pattern modifications
- **Texture Variations**: Subtle texture differences
- **Symmetry Adjustments**: Minor symmetry changes

**Moderate Mutations**:
- **Feature Modifications**: Altered family-specific features
- **Element Blending**: Visual blending of multiple elements
- **Color Mixing**: Colors that blend from multiple elements
- **Texture Mixing**: Textures that combine multiple families
- **Pattern Fusions**: Combined patterns from parents

**Major Mutations**:
- **Feature Addition**: New features from fusion process
- **Element Fusion**: Clear visual fusion of elements
- **Complex Color**: Deep color fusion between elements
- **Hybrid Textures**: Textures that are clearly hybrid
- **Fusion Scars**: Visible marks of the fusion process

**Glitch Mutations**:
- **Glitch Artifacts**: Digital glitch corruption effects
- **Data Stream**: Visual data flow effects
- **Pixel Distortion**: Intentional pixel corruption
- **Reality Distortion**: Visual reality distortion effects
- **Paradox Patterns**: Impossible visual patterns

## Compositing System

### Blend Modes
- **Normal**: Standard layer blending
- **Multiply**: Darkens underlying layers
- **Screen**: Lightens underlying layers
- **Overlay**: Preserves shadows/highlights while adding color
- **Soft Light**: Subtle color addition with luminosity preservation

### Compositing Process
1. **Start with Core Layer**: Begin with base body shape
2. **Apply Element Overlay**: Add elemental effects using appropriate blend modes
3. **Add Family Traits**: Apply family-specific features
4. **Apply Fusion Mutations**: Add fusion-specific mutations
5. **Apply Final Adjustments**: Color correction, contrast, etc.
6. **Export Result**: Save as PNG with optimized palette

### Animation Integration
- **Frame-by-Frame**: Each layer can have multiple frames
- **Independent Animation**: Layers can animate independently
- **Synchronized Effects**: Some effects synchronize across layers
- **Performance Optimization**: Animation culling for performance

## Seed-Based Determinism

### Concept
All sprite generation uses seeded randomization to ensure the same inputs produce the same visual output.

### Implementation
- **Fusion Signature Seed**: Uses fusion signature as base seed
- **Layer-Specific Seeds**: Each layer gets derivative seed
- **Reproducible**: Same fusion = same sprite every time
- **Verification**: Can regenerate sprites to verify authenticity

### Seed Generation Process
1. **Base Seed**: Hash of complete fusion signature
2. **Layer Seeds**: Hash of base seed + layer index
3. **Feature Seeds**: Hash of layer seed + feature index
4. **Animation Seeds**: Hash of feature seed + frame index

## Palette System

### Color Management
- **Family Palettes**: Each family has defined color ranges
- **Element Palettes**: Each element has specific color properties
- **Mutation Palettes**: Fusion mutations have specific color ranges
- **Glitch Palette**: Special palette for glitch effects

### Palette Generation Process
1. **Base Palette**: Family-specific base color scheme
2. **Element Modifiers**: Modify palette based on elements
3. **Mutation Adjustments**: Adjust palette based on mutations
4. **Final Optimization**: Optimize for 256-color limit

## Performance Optimization

### Generation Speed
- **Layer Caching**: Cache generated layers for reuse
- **Template Reuse**: Reuse common templates and elements
- **Palette Optimization**: Optimize palette generation
- **Async Processing**: Process sprites in background

### Memory Management
- **Sprite Compression**: Compress sprites when not in use
- **LOD System**: Lower resolution for distant display
- **Texture Atlases**: Combine sprites for efficient rendering
- **Resource Pooling**: Reuse sprite generation resources

## Integration with Game Systems

### Pet System Integration
- **Sprite Generation**: Generate sprites upon pet creation
- **Sprite Updates**: Update sprites when pet changes
- **Sprite Verification**: Verify sprite authenticity
- **Sprite Storage**: Efficient storage and retrieval

### Fusion System Integration
- **Automatic Generation**: Generate sprites during fusion
- **Signature Link**: Link sprites to fusion signatures
- **Mutation Tracking**: Track mutations in sprite generation
- **Quality Assessment**: Assess sprite quality in fusion

### Combat System Integration
- **Display Optimization**: Optimize sprites for combat display
- **Animation Sync**: Synchronize sprite animations with combat
- **Visual Effects**: Integrate combat effects with sprites
- **Performance**: Maintain performance during battles

### Collection System Integration
- **Display Modes**: Multiple display modes for sprites
- **Comparison Tools**: Compare sprites side-by-side
- **Filtering**: Filter by sprite characteristics
- **Search**: Search by visual characteristics

## Quality Assurance

### Visual Consistency
- **Style Guide**: Maintain consistent visual style
- **Quality Checks**: Verify generated sprites meet standards
- **Consistency Verification**: Ensure family and element consistency
- **Mutation Validity**: Verify mutations are appropriate

### Technical Standards
- **Resolution Compliance**: Ensure all sprites meet resolution standards
- **Color Depth**: Maintain appropriate color depth
- **File Size**: Optimize for appropriate file size
- **Transparency**: Maintain proper transparency channels

### Validation Process
1. **Automatic Checks**: Automatically verify sprite parameters
2. **Consistency Checks**: Check for visual consistency
3. **Family Alignment**: Verify alignment with family traits
4. **Element Integration**: Verify element effects are appropriate
5. **Mutation Appropriateness**: Verify mutations are reasonable
6. **Performance**: Check for performance considerations

## Customization Options

### Visual Settings
- **Detail Level**: Adjust level of visual detail
- **Animation Quality**: Control animation smoothness
- **Color Vibrancy**: Adjust color intensity
- **Effect Intensity**: Control special effect strength

### Performance Settings
- **Resolution**: Choose between 64x64 and 128x128
- **Animation**: Enable/disable animations
- **Effects**: Enable/disable special visual effects
- **Quality**: Choose between quality and performance

## Future Enhancements

### Advanced Features
- **3D Effects**: Add pseudo-3D layer effects
- **Dynamic Lighting**: Add lighting effects based on environment
- **Weather Effects**: Change sprites based on weather
- **Mood Effects**: Change sprites based on pet mood

### Technical Improvements
- **Advanced Compression**: Better sprite compression algorithms
- **Procedural Generation**: More complex procedural elements
- **AI Integration**: AI-assisted sprite generation
- **Cross-Platform**: Optimize for different platforms

---

This completes the design specification for the layered sprite generation system in Pixel Pets Reborn X Remerged. The 4-layer system provides rich, unique visual representations for each pet while maintaining performance and ensuring visual consistency with the game's aesthetic.