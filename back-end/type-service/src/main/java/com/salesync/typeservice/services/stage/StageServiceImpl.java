package com.salesync.typeservice.services.stage;

import com.salesync.typeservice.dtos.StageDto;
import com.salesync.typeservice.entities.Stage;
import com.salesync.typeservice.entities.Type;
import com.salesync.typeservice.enums.TemplateEnum;
import com.salesync.typeservice.exceptions.ObjectNotFoundException;
import com.salesync.typeservice.exceptions.TypeServiceException;
import com.salesync.typeservice.mapper.StageMapper;
import com.salesync.typeservice.repositories.StageRepository;
import com.salesync.typeservice.repositories.TypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StageServiceImpl implements StageService {
    private final StageRepository stageRepository;
    private final TypeRepository typeRepository;
    private final StageMapper stageMapper = StageMapper.INSTANCE;
    @Override
    public StageDto createStage(StageDto stageDto) {
        Type type = typeRepository.findById(stageDto.getType().getId()).orElseThrow(
                () -> new ObjectNotFoundException(
                        Type.class.getSimpleName(),
                        stageDto.getType().getId().toString()
                )
        );
        if (TemplateEnum.StageObject.equals(type.getTemplate().getName())) {
            Stage stage = stageMapper.dtoToEntity(stageDto);
            stage.setType(type);
            Integer seq = stageRepository.findTopByTypeIdOrderBySequenceNumberDesc(type.getId())
                    .map(Stage::getSequenceNumber)
                    .orElse(0);
            stage.setSequenceNumber(seq + 1);
            return stageMapper.entityToDto(stageRepository.save(stage));
        }
        throw new TypeServiceException("Type is not a stage object");
    }
}