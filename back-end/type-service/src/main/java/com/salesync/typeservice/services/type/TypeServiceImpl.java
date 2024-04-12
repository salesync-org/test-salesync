package com.salesync.typeservice.services.type;

import com.salesync.typeservice.dtos.*;
import com.salesync.typeservice.entities.*;
import com.salesync.typeservice.exceptions.ObjectNotFoundException;
import com.salesync.typeservice.exceptions.BadRequestException;
import com.salesync.typeservice.mapper.RelationMapper;
import com.salesync.typeservice.mapper.TypeMapper;
import com.salesync.typeservice.mapper.TypeRelationMapper;
import com.salesync.typeservice.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional(rollbackFor = Throwable.class)
@Service
@RequiredArgsConstructor
public class TypeServiceImpl implements TypeService {
    private final TypeRepository typeRepository;
    private final TypeRelationMapper typeRelationMapper = TypeRelationMapper.INSTANCE;

    private final TypeRelationRepository typeRelationRepository;

    private final TypePropertyFieldRepository typePropertyFieldRepository;

    private final RelationRepository relationRepository;

    private final TypePropertyRepository typePropertyRepository;

    private final PropertyFieldRepository propertyFieldRepository;

    private final PropertyRepository propertyRepository;

    private final RelationMapper relationMapper = RelationMapper.INSTANCE;

    private final TypeMapper typeMapper = TypeMapper.INSTANCE;

    @Override
    public TypeDTO createType(TypeDTO typeDTO) {

        Type savedType = typeRepository.save(typeMapper.typeDTOToType(typeDTO));
        return typeMapper.typeToTypeDTO(savedType);

    }

    @Override
    public TypeDTO getType(UUID typeId) {
        Type type = typeRepository.findById(typeId)
                .orElseThrow(() -> new ObjectNotFoundException(
                                Type.class.getSimpleName(),
                                typeId.toString()
                        )
                );
        return typeMapper.typeToTypeDTO(type);
    }

    @Override
    public List<TypeDTO> getAllType() {
        return typeRepository.findAll()
                .stream()
                .map(typeMapper::typeToTypeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TypeRelationDTO> getAllRelationsByType(UUID typeId) {
        return typeRelationRepository
                .findAllBySourceTypeId(typeId)
                .stream()
                .map(typeRelation -> TypeRelationDTO.builder()
                        .id(typeRelation.getId())
                        .sourceType(typeMapper.typeToTypeDTO(typeRelation.getSourceType()))
                        .destinationType(typeMapper.typeToTypeDTO(typeRelation.getDestinationType()))
                        .relation(relationMapper.relationToRelationDTO(typeRelation.getRelation()))
                        .sourceTypeLabel(typeRelation.getSourceTypeLabel())
                        .destinationTypeLabel(typeRelation.getDestinationLabel())
                        .build())
                .collect(Collectors.toList()
                );
    }

    @Override
    public TypeRelationResponseDTO makeRelation(TypeRelationDTO typeRelationDTO) {
        UUID sourceTypeId = typeRelationDTO.getSourceType().getId();
        Type sourceType = typeRepository
                .findById(sourceTypeId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Source type",
                        sourceTypeId.toString()
                ));

        UUID destinationTypeId = typeRelationDTO.getDestinationType().getId();
        Type destinationType = typeRepository
                .findById(destinationTypeId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Destination type",
                        destinationTypeId.toString()
                ));

        UUID relationId = typeRelationDTO.getRelation().getId();
        Relation relation = relationRepository
                .findById(relationId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Relation",
                        relationId.toString()
                ));

        Relation inverseRelation = relation.getInverseRelation();
        String sourceLabel = typeRelationDTO.getSourceTypeLabel();
        String destinationLabel = typeRelationDTO.getDestinationTypeLabel();

        //constructor without id
        TypeRelation typeRelation = TypeRelation.builder()
                .sourceType(sourceType)
                .sourceTypeLabel(sourceLabel)
                .destinationType(destinationType)
                .destinationLabel(destinationLabel)
                .relation(relation)
                .build();

        TypeRelation inverseTypeRelation = TypeRelation.builder()
                .sourceType(destinationType)
                .sourceTypeLabel(destinationLabel)
                .destinationType(sourceType)
                .destinationLabel(sourceLabel)
                .relation(inverseRelation)
                .build();

        TypeRelationDTO savedSource = typeRelationMapper
                .typeRelationToTypeRelationDTO(typeRelationRepository.save(typeRelation));
        TypeRelationDTO savedDestination = typeRelationMapper
                .typeRelationToTypeRelationDTO(typeRelationRepository.save(inverseTypeRelation));

        return TypeRelationResponseDTO.builder()
                .sourceTypeRelation(savedSource)
                .destinationTypeRelation(savedDestination)
                .build();
    }

    @Override
    public TypeRelationResponseDTO updateLabelOfTypeRelation(TypeRelationDTO typeRelationDTO) {
        UUID typeRelationId = typeRelationDTO.getId();
        TypeRelation typeRelation = typeRelationRepository
                .findById(typeRelationId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Type relation",
                        typeRelationId.toString()
                ));

        UUID destinationTypeId = typeRelation.getDestinationType().getId();
        UUID sourceTypeId = typeRelation.getSourceType().getId();
        UUID inverseRelationId = typeRelation.getRelation().getInverseRelation().getId();
        TypeRelation inverseTypeRelation = typeRelationRepository
                .findBySourceTypeIdAndDestinationTypeIdAndRelationId(destinationTypeId, sourceTypeId, inverseRelationId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Inverse type relation is not found"
                ));

        typeRelation.setDestinationLabel(typeRelationDTO.getDestinationTypeLabel());
        typeRelation.setSourceTypeLabel(typeRelationDTO.getSourceTypeLabel());

        inverseTypeRelation.setDestinationLabel(typeRelationDTO.getSourceTypeLabel());
        inverseTypeRelation.setSourceTypeLabel(typeRelationDTO.getDestinationTypeLabel());

        TypeRelationDTO savedTypeRelation = typeRelationMapper.typeRelationToTypeRelationDTO(typeRelationRepository.save(typeRelation));
        TypeRelationDTO savedInverseTypeRelation = typeRelationMapper.typeRelationToTypeRelationDTO(typeRelationRepository.save(inverseTypeRelation));
        return TypeRelationResponseDTO.builder().sourceTypeRelation(savedTypeRelation).destinationTypeRelation(savedInverseTypeRelation).build();

    }

    @Override
    public Type getTypeDetailsById(UUID typeId) {
        return typeRepository.findById(typeId)
                .orElseThrow(() -> new ObjectNotFoundException(
                        Type.class.getSimpleName(),
                        typeId.toString()
                ));
    }

    @Override
    public TypeProperty createProperty(RequestCreatePropertyDto requestCreatePropertyDto) {
        Type type = typeRepository.findById(requestCreatePropertyDto.getTypeId())
                .orElseThrow(() -> new ObjectNotFoundException(
                        Type.class.getSimpleName(),
                        requestCreatePropertyDto.getTypeId().toString()
                ));

        Property property= propertyRepository.findById(requestCreatePropertyDto.getPropertyId())
                .orElseThrow(() -> new ObjectNotFoundException(
                        Property.class.getSimpleName(),
                        requestCreatePropertyDto.getPropertyId().toString()
                ));


        //check có đầy đủ các field của property chưa
        Set<UUID> propertyFieldSet=
                property.getPropertyFields().stream()
                .map(PropertyField::getId)
                .collect(Collectors.toSet());

        Set<UUID> requestSet = requestCreatePropertyDto.getFields().stream()
                .map(RequestTypePropertyFieldDto::getPropertyFieldId)
                .collect(Collectors.toSet());

        System.out.println("propertyFieldSet: "+propertyFieldSet);

        System.out.println("requestSet: "+requestSet);

        System.out.println(requestCreatePropertyDto.toString());

        if (!propertyFieldSet.equals(requestSet)) {
            throw new BadRequestException(
                    "Property fields"
            );

        }
        TypeProperty typeProperty = TypeProperty.builder()
                .property(property)

                .type(type)
                .name(requestCreatePropertyDto.getName())
                .defaultValue(requestCreatePropertyDto.getDefaultValue())
                .label(requestCreatePropertyDto.getLabel())
                .sequence(requestCreatePropertyDto.getSequence())
                .build();

        TypeProperty savedTypeProperty= typePropertyRepository.save(typeProperty);

        List<TypePropertyField> typePropertyFieldList;
        typePropertyFieldList = requestCreatePropertyDto.getFields().stream()
                .map(requestTypePropertyFieldDto -> {
                    PropertyField propertyField = propertyFieldRepository.findById(requestTypePropertyFieldDto.getPropertyFieldId())
                            .orElseThrow(() -> new ObjectNotFoundException(
                                    PropertyField.class.getSimpleName(),
                                    requestTypePropertyFieldDto.getPropertyFieldId().toString()
                            ));

                    String requestItemValue=requestTypePropertyFieldDto.getItemValue();
                    String itemValue = requestItemValue != null &&
                            !requestItemValue.isEmpty()
                            ? requestItemValue : propertyField.getDefaultValue();

                    return TypePropertyField.builder()
                            .propertyField(propertyField)
                            .itemValue(itemValue)
                            .typeProperty(savedTypeProperty)
                            .build();
                })
                .collect(Collectors.toList());
        typePropertyFieldRepository.saveAll(typePropertyFieldList);

        savedTypeProperty.setTypePropertyFields(typePropertyFieldList);

        return savedTypeProperty;
    }
}
